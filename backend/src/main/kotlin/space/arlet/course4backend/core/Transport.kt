package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "transports")
data class Transport(
    @Id val transportNumber: String,
    val packsCapacity: Int?,
    val maxWeight: Double?,
)