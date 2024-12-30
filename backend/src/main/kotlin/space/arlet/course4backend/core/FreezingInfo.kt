package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import java.time.LocalDate

/***
 * FreezingInfo характеризует местонахождение замороженной партии пельменей
 */
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

    @Min(value = -100)
    @Max(value = 5)
    // In C degrees
    val temperature: Double,
    val loadDate: LocalDate,
    val uploadDate: LocalDate?,
)