package space.arlet.course4backend.core

import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalDate

/***
 * Employee характеризует работников фабрики.
 * У них присутствуют платежные данные и согласие на обработку персональных данных
 */
@Entity
@Table(name = "employees")
data class Employee(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    val id: Int,

    @Size(max = 100)
    val fullName: String,

    @Size(max = 100)
    val jobTitle: String?,

    val employmentDate: LocalDate,
    val dismissalDate: LocalDate?,

    @OneToMany
    val paymentInfo: List<PaymentInfo>?,

    @OneToMany
    val agreement: List<Document>?,
)