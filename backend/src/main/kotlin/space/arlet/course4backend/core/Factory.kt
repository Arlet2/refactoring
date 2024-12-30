package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Size

/***
 * Factory характеризует место производства пельменей
 */
@Entity
@Table(name = "factories")
data class Factory(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,

    @Size(min = 10, max = 100)
    val address: String,
)