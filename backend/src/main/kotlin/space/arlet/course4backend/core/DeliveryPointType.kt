package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "delivery_point_types")
data class DeliveryPointType(
    @Id val name: String,
)