package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min

/***
 * Section характеризует место хранения замороженных пельменей
 */
@Entity
@Table(name = "sections")
data class Section(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,

    @Max(value = 100000)
    @Min(value = 1)
    val size: Int,
)