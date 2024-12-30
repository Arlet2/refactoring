package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDate
@Entity
@Table(name = "freezings_info")
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