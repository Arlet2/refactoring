package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.validation.constraints.Max

/***
 * BatchDelivery характеризует сколько и какими поставками была отправлена партия
 */
@Entity
@Table(name = "batch_deliveries")
data class BatchDelivery(
    @ManyToOne
    @Id
    val delivery: Delivery,
    @ManyToOne
    @Id
    val batch: Batch,
    @Max(value = 10000)
    val amount: Int,

    @Max(value = 10000)
    val mass: Double?,
)