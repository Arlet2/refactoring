package space.arlet.course4backend.core

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "tech_reports")
data class TechReport(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    @ManyToOne
    val reporter: Employee,
    @ManyToOne
    val shift: WorkShift,
    val state: Int,
    val created: LocalDateTime?,
    val description: String?,
)