package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import java.time.LocalDateTime

/***
Batch характеризует одну партию изготовленных пельменей.
Пельмени бывают разных типов (мясные, мусульманские и тд) и разных размеров.

Также учитывается масса испорченных пельменей

 ***/
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

    @OneToOne val shift: WorkShift?,
    @ManyToOne val pelmeniType: PelmeniType?,
    @ManyToOne val pelmeniSize: PelmeniSize?,

    @Max(value = 10000)
    // In kg
    val summaryMass: Double,
    val created: LocalDateTime,

    @ManyToOne
    val factory: Factory,
    val packageTime: LocalDateTime?,

    @Max(value = 1000000)
    @Min(value = 1)
    val packsCount: Int?,

    @Max(value = 1000000)
    // In kg
    val massOfDefective: Double?,
)