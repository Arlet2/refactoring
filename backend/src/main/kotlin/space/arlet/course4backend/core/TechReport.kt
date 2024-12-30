package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

/***
 * TechReport характеризует отчет под конец смены
 */
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

    /***
     * 0 - OK
     * 1 - неисправен конвейер
     * 2 - ***
     */
    val state: Int,
    val created: LocalDateTime?,

    @Size(max = 1000)
    val description: String?,
)