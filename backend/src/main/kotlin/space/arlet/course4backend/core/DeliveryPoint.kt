package space.arlet.course4backend.core

import jakarta.persistence.*

@Entity
@Table(name = "delivery_points")
data class DeliveryPoint(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    val address: String,
    @ManyToOne
    val pointType: DeliveryPointType?,
    val packsCapacity: Int,
)