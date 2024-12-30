package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Size

/***
 * PelmeniType характеризует тип пельменей и способ их приготовления
 */
@Entity
@Table(name = "pelmeni_types")
data class PelmeniType(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,

    @Size(max = 1000)
    val name: String,

    @Size(min = 10, max = 10000)
    val recipe: String,
)