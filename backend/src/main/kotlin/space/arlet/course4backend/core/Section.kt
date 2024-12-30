package space.arlet.course4backend.core

import jakarta.persistence.*

@Entity
@Table(name = "sections")
data class Section(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    val size: Int,
)