package space.arlet.course4backend.core

import jakarta.persistence.*

@Entity
@Table(name = "factories")
data class Factory(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    val address: String,
)