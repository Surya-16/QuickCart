package com.zosh.controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.zosh.exception.OrderException;
import com.zosh.exception.UserException;
import com.zosh.modal.Order;
import com.zosh.modal.User;
import com.zosh.repository.OrderRepository;
import com.zosh.response.ApiResponse;
import com.zosh.response.PaymentLinkResponse;
import com.zosh.service.OrderService;
import com.zosh.service.UserService;
import com.zosh.user.domain.OrderStatus;
import com.zosh.user.domain.PaymentStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/api")
public class PaymentController {
	
	private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
	
	@Value("${razorpay.api.key}")
	private String apiKey;

	@Value("${razorpay.api.secret}")
	private String apiSecret;
	
	private OrderService orderService;
	private UserService userService;
	private OrderRepository orderRepository;
	
	public PaymentController(OrderService orderService,UserService userService,OrderRepository orderRepository) {
		this.orderService=orderService;
		this.userService=userService;
		this.orderRepository=orderRepository;
	}
	
	@PostMapping("/payments/{orderId}")
	public ResponseEntity<PaymentLinkResponse> createPaymentLink(@PathVariable Long orderId,
			@RequestHeader("Authorization") String jwt) 
					throws RazorpayException, UserException, OrderException{
		
		Order order = orderService.findOrderById(orderId);
		try {
			// Initialize Razorpay without logging sensitive information
			logger.info("Initializing Razorpay payment for order: {}", orderId);
			
			RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
			
			// Create payment request
			JSONObject paymentLinkRequest = new JSONObject();
			paymentLinkRequest.put("amount", order.getTotalPrice() * 100); // Fix: amount should be in paise (100 paise = 1 INR)
			paymentLinkRequest.put("currency", "INR");
			
			// Log the request payload without sensitive data
			logger.info("Creating payment request for order: {}", orderId);				
			
			// Create customer details
			JSONObject customer = new JSONObject();
			customer.put("name", order.getUser().getFirstName() + " " + order.getUser().getLastName());
			customer.put("contact", order.getUser().getMobile());
			customer.put("email", "suryavs16@gmail.com"); // Uncommented as this is required by Razorpay
			paymentLinkRequest.put("customer", customer);
			
			// Set notification settings
			JSONObject notify = new JSONObject();
			notify.put("sms", true);
			notify.put("email", true);
			paymentLinkRequest.put("notify", notify);
			
			// Set callback details
			paymentLinkRequest.put("callback_url", "http://localhost:3000/payment-success?order_id=" + orderId);
			paymentLinkRequest.put("callback_method", "get");
			
			try {
				// Create payment link
				PaymentLink payment = razorpay.paymentLink.create(paymentLinkRequest);
				
				// Log the successful response
				logger.info("Payment link created successfully for order: {}", orderId);
				String paymentLinkId = payment.get("id");
				String paymentLinkUrl = payment.get("short_url");
				
				PaymentLinkResponse res = new PaymentLinkResponse(paymentLinkUrl, paymentLinkId);
				
				// Fetch and update order
				PaymentLink fetchedPayment = razorpay.paymentLink.fetch(paymentLinkId);
				order.setOrderId(fetchedPayment.get("order_id"));
				orderRepository.save(order);
				
				logger.info("Order {} updated with payment link ID: {}", orderId, paymentLinkId);
				
				return new ResponseEntity<PaymentLinkResponse>(res, HttpStatus.ACCEPTED);
				
			} catch (RazorpayException e) {
				// Log the error details without using undefined method
				logger.error("Razorpay Error: {}", e.getMessage());
				//logger.error("Full error details", e);
				throw e;
			}
			
		} catch (Exception e) {
			throw e;
		}
	}
	
	@GetMapping("/payments")
	public ResponseEntity<ApiResponse> redirect(@RequestParam(name = "payment_id") String paymentId,
			@RequestParam("order_id") Long orderId) throws RazorpayException, OrderException {
		
		logger.info("Payment callback received - Payment ID: {}, Order ID: {}", paymentId, orderId);
		
		try {
			RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
			Payment payment = razorpay.payments.fetch(paymentId);
			
			logger.info("Payment status fetched - Status: {}", payment.get("status").toString());
			
			if (payment.get("status").equals("captured")) {
				Order order = orderService.findOrderById(orderId);
				order.getPaymentDetails().setPaymentId(paymentId);
				order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
				order.setOrderStatus(OrderStatus.PLACED);
				
				orderRepository.save(order);
				logger.info("Order updated with payment success - Order ID: {}", orderId);
				
				ApiResponse res = new ApiResponse("Your order has been placed", true);
				return new ResponseEntity<ApiResponse>(res, HttpStatus.OK);
			}
			
			logger.warn("Payment not captured - Payment ID: {}, Status: {}", 
				paymentId, 
				payment.get("status")
			);
			
			throw new RazorpayException("Payment failed");
			
		} catch (Exception e) {
			logger.error("Error processing payment callback: {}", e.getMessage());
			throw e;
		}
	}
}
