package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "work_shift_employees")
data class WorkShiftEmployee(
    @Id
    @ManyToOne
    val employee: Employee,
    @Id
    @ManyToOne
    val shift: WorkShift,
    val shiftManager: Boolean?,
)