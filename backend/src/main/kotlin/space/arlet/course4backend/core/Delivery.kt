package space.arlet.course4backend.core

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "deliveries")
data class Delivery(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    @ManyToOne
    val transport: Transport?,
    @ManyToOne
    val deliveryPoint: DeliveryPoint?,
    val packsCount: Int?,
    @ManyToOne
    val factory: Factory?,
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    val departureDate: LocalDateTime?,
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    val arrivalDate: LocalDateTime?,
)