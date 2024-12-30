package space.arlet.course4backend.core

import jakarta.persistence.*

@Entity
@Table(name = "pelmeni_types")
data class PelmeniType(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    val name: String,
    val recipe: String,
)