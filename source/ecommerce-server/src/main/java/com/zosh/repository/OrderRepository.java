package com.zosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.zosh.modal.Order;
import com.zosh.user.domain.OrderStatus;
import com.zosh.user.domain.PaymentStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {

	@Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.orderStatus IN (com.zosh.user.domain.OrderStatus.PENDING, com.zosh.user.domain.OrderStatus.PLACED, com.zosh.user.domain.OrderStatus.CONFIRMED, com.zosh.user.domain.OrderStatus.SHIPPED, com.zosh.user.domain.OrderStatus.DELIVERED)")
	public List<Order> getUsersOrders(@Param("userId") Long userId);
	
	List<Order> findAllByOrderByCreatedAtDesc();
	
	@Modifying
	@Transactional
	@Query(value = "UPDATE orders SET order_status = 'PLACED' WHERE id = :orderId", nativeQuery = true)
	public int updateOrderStatusToPlaced(@Param("orderId") Long orderId);
}
