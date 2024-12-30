package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Size

/***
 * Document характеризует документ, относящийся к работе фабрики, который необходимо подписывать
 */
@Entity
@Table(name = "documents")
data class Document(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,

    @Size(min = 10, max = 100)
    val name: String,

    val dataURL: String,
    @ManyToOne
    val owner: Employee?,
    val signed: Boolean?,
)