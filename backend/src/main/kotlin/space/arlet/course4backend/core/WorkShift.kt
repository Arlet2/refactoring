package space.arlet.course4backend.core

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "work_shifts")
data class WorkShift(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    @OneToOne
    val batch: Batch,
    @OneToOne
    val conveyor: Conveyor,
    val timeStart: LocalDateTime?,
    val timeEnd: LocalDateTime?,
)