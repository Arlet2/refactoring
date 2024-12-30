package space.arlet.course4backend.core

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import java.time.LocalDateTime

/***
 * Delivery характеризует доставку пельменей в определенное место (склад, магазин)
 */
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

    @Max(value = 1000000)
    @Min(value = 1)
    val packsCount: Int?,

    @ManyToOne
    val factory: Factory?,

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    val departureDate: LocalDateTime?,

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    val arrivalDate: LocalDateTime?,
)