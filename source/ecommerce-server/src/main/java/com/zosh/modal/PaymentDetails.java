package com.zosh.modal;

import com.zosh.user.domain.PaymentMethod;
import com.zosh.user.domain.PaymentStatus;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
@Embeddable
public class PaymentDetails {
	
	@Enumerated(EnumType.STRING)
	private PaymentMethod paymentMethod;
	
	@Enumerated(EnumType.STRING)
	private PaymentStatus status;
	
	private String paymentId;
	private String razorpayPaymentId;
	private String razorpayPaymentLinkId;
	private String razorpayPaymentLinkReferenceId;
	private String razorpayPaymentLinkStatus;
}
