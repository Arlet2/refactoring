package space.arlet.course4backend.core

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(
    name = "freezings_info",
    indexes = [
        Index(columnList = "temperature")
    ]
)
data class FreezingInfo(
    @Id
    @ManyToOne
    val batch: Batch,
    @Id
    @ManyToOne
    val section: Section,
    val temperature: Double,
    val loadDate: LocalDate,
    val uploadDate: LocalDate?,
)