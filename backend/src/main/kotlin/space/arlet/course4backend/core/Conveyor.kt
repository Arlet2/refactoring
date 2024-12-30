package space.arlet.course4backend.core

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "conveyors")
data class Conveyor(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    @ManyToOne
    val manager: Employee,
    val name: String?,
    val commissioningDate: LocalDate?,
    @ManyToOne
    val factory: Factory?,
    val decommissioningDate: LocalDate?,
)