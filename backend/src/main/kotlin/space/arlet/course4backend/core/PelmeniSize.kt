package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

/***
 * PelmeniSize характеризует размер пельменей в маркетинговых целях. Например, XL, XSS и тд
 */
@Entity
@Table(name = "pelmeni_sizes")
data class PelmeniSize(
    @Id val name: String,
)