package space.arlet.course4backend.core

import jakarta.persistence.*

@Entity
@Table(name = "payments_info")
data class PaymentInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,
    val salary: Int,
    val bankName: String,
    val accountNumber: String,
    val bik: String?,
    val corrAccount: String?,
    val inn: String?,
    val kpp: String?,
)