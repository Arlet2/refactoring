package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size

/***
 * PaymentInfo характеризует счет для отправки зарплаты работникам
 */
@Entity
@Table(name = "payments_info")
data class PaymentInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,

    @Min(1)
    @Max(10000000)
    // In rubles
    val salary: Int,

    @Size(min = 5, max = 100)
    val bankName: String,

    @Size(min = 10, max = 20)
    val accountNumber: String,

    @Size(min = 10, max = 20)
    val bik: String?,

    @Size(min = 10, max = 20)
    val corrAccount: String?,

    @Size(min = 10, max = 20)
    val inn: String?,

    @Size(min = 10, max = 20)
    val kpp: String?,
)