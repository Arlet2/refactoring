package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

/***
 * DeliveryPointType - тип точки доставки. Например, склад или магазин
 */
@Entity
@Table(name = "delivery_point_types")
data class DeliveryPointType(
    @Id val name: String,
)