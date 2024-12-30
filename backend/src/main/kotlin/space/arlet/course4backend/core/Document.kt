package space.arlet.course4backend.core

import jakarta.persistence.*

@Entity
@Table(name = "documents")
data class Document(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    val name: String,
    val dataURL: String,
    @ManyToOne
    val owner: Employee?,
    val signed: Boolean?,
)