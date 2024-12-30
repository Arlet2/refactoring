package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "pelmeni_sizes")
data class PelmeniSize(
    @Id val name: String,
)