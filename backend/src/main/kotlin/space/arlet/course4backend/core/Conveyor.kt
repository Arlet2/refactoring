package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalDate

/***
 * Conveyor характеризует конвейер производства пельменей.
 * У каждого конвейера есть свой менеджер и имя для их различия.
 * Каждый конвейер может производить только один тип пельменей
 */
@Entity
@Table(name = "conveyors")
data class Conveyor(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    @ManyToOne
    val manager: Employee,

    @Size(min = 3, max = 50)
    val name: String?,
    val commissioningDate: LocalDate?,
    @ManyToOne
    val factory: Factory?,
    val decommissioningDate: LocalDate?,
)