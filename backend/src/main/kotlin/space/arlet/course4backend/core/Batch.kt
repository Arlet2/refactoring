package space.arlet.course4backend.core

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "batches")
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