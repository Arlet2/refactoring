package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Size

/***
 * DeliveryPoint - точка доставки пельменей
 */
@Entity
@Table(
    name = "delivery_points",
    indexes = [
        Index(columnList = "packsCapacity")
    ]
)
data class DeliveryPoint(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    @Size(min = 10, max = 300)
    val address: String,

    @ManyToOne
    val pointType: DeliveryPointType?,

    @Max(value = 1000000)
    val packsCapacity: Int,
)