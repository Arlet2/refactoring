package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.Table
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min

/***
 * Transport характеризует транспорт для перевозки пельменей
 */
@Entity
@Table(
    name = "transports",
    indexes = [
        Index(name = "capacity_index", columnList = "maxWeight, packsCapacity"),
    ],
)
data class Transport(
    @Id val transportNumber: String,

    @Min(value = 100000)
    val packsCapacity: Int?,

    @Max(value = 10)
    // In tons
    val maxWeight: Double?,
)