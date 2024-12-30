package space.arlet.course4backend.core

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "batches",
    indexes = [
        Index(name = "package_time_index", columnList = "packageTime"),
        Index(name = "packs_count_index", columnList = "packsCount"),
        Index(name = "summary_mass_index", columnList = "summaryMass"),
    ],
)
data class Batch(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    @OneToOne
    val shift: WorkShift?,
    @ManyToOne
    val pelmeniType: PelmeniType?,
    @ManyToOne
    val pelmeniSize: PelmeniSize?,
    val summaryMass: Double,
    val created: LocalDateTime,
    @ManyToOne
    val factory: Factory,
    val packageTime: LocalDateTime?,
    val packsCount: Int?,
    val massOfDefective: Double?,
)