package com.zosh.controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
import com.zosh.user.domain.PaymentMethod;
import com.zosh.user.domain.PaymentStatus;
import com.razorpay.*;

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
	
	public PaymentController(OrderService orderService, UserService userService, OrderRepository orderRepository) {
		this.orderService = orderService;
		this.userService = userService;
		this.orderRepository = orderRepository;
	}
	
	@PostMapping("/payments/{orderId}")
	public ResponseEntity<PaymentLinkResponse> createPaymentLink(@PathVariable Long orderId,
			@RequestHeader("Authorization") String jwt) 
					throws RazorpayException, UserException, OrderException {
		
		Order order = orderService.findOrderById(orderId);
		try {
			RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
			
			JSONObject paymentLinkRequest = new JSONObject();
			paymentLinkRequest.put("amount", order.getTotalPrice() * 100);
			paymentLinkRequest.put("currency", "INR");
			
			JSONObject customer = new JSONObject();
			customer.put("name", order.getUser().getFirstName() + " " + order.getUser().getLastName());
			customer.put("contact", order.getUser().getMobile());
			customer.put("email", order.getUser().getEmail());
			paymentLinkRequest.put("customer", customer);
			
			JSONObject notify = new JSONObject();
			notify.put("sms", true);
			notify.put("email", true);
			paymentLinkRequest.put("notify", notify);
			
			paymentLinkRequest.put("callback_url", "http://localhost:3000/payment-success?order_id=" + orderId);
			paymentLinkRequest.put("callback_method", "get");
			
			PaymentLink payment = razorpay.paymentLink.create(paymentLinkRequest);
			String paymentLinkId = payment.get("id");
			String paymentLinkUrl = payment.get("short_url");
			
			order.getPaymentDetails().setRazorpayPaymentLinkId(paymentLinkId);
			orderRepository.save(order);
			
			PaymentLinkResponse res = new PaymentLinkResponse(paymentLinkUrl, paymentLinkId);
			return new ResponseEntity<PaymentLinkResponse>(res, HttpStatus.ACCEPTED);
			
		} catch (Exception e) {
			throw e;
		}
	}
	
	@GetMapping("/payments")
	public ResponseEntity<ApiResponse> redirect(@RequestParam(name = "payment_id") String paymentId,
			@RequestParam("order_id") Long orderId,
			@RequestParam(name = "razorpay_payment_link_id", required = false) String razorpayPaymentLinkId,
			@RequestParam(name = "razorpay_payment_link_reference_id", required = false) String razorpayPaymentLinkReferenceId,
			@RequestParam(name = "razorpay_payment_link_status", required = false) String razorpayPaymentLinkStatus) 
			throws RazorpayException, OrderException {
		
		logger.info("Payment callback received - Payment ID: {} for Order ID: {}", paymentId, orderId);
		
		try {
			RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
			Payment payment = razorpay.payments.fetch(paymentId);
			
			logger.info("Payment status fetched - Status: {}", (String)payment.get("status"));
			
			if (payment.get("status").equals("captured")) {
				Order order = orderService.findOrderById(orderId);
				
				// Update payment details
				order.getPaymentDetails().setPaymentId(paymentId);
				order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
				order.getPaymentDetails().setPaymentMethod(PaymentMethod.RAZORPAY);
				order.getPaymentDetails().setRazorpayPaymentId(paymentId);
				order.getPaymentDetails().setRazorpayPaymentLinkId(razorpayPaymentLinkId);
				order.getPaymentDetails().setRazorpayPaymentLinkReferenceId(razorpayPaymentLinkReferenceId);
				order.getPaymentDetails().setRazorpayPaymentLinkStatus(razorpayPaymentLinkStatus);
				
				// Save the order with updated payment details first
				order = orderRepository.save(order);
				
				// Then update order status to PLACED - this will also save the order
				order = orderService.placedOrder(orderId);
				
				logger.info("Order {} updated with payment success and status PLACED", orderId);
				
				ApiResponse res = new ApiResponse("Your order has been placed", true);
				return new ResponseEntity<ApiResponse>(res, HttpStatus.OK);
			}
			
			logger.warn("Payment not captured - Payment ID: {}, Status: {}", 
				paymentId, 
				(String)payment.get("status")
			);
			
			throw new RazorpayException("Payment failed");
			
		} catch (Exception e) {
			logger.error("Error processing payment callback: {}", e.getMessage());
			throw e;
		}
	}
}
