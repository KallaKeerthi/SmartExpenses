import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, participants } = req.body;

    const finalParticipants = Array.isArray(participants) && participants.length > 0
    ? [...new Set([...participants, req.user._id.toString()])]  // Ensure ObjectId strings
    : [req.user._id.toString()];

    const expense = await Expense.create({
      description: title,
      amount,
      category,
      date: date || Date.now(),
      paidBy: req.user._id,
      participants: finalParticipants
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);  // Will print the full error for debugging
    res.status(500).json({ message: err.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.user._id },
        { participants: req.user._id }
      ]
    }).populate("paidBy", "username email");

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // (Optional) Authorization check: only owner can delete
    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Only the owner can update
    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this expense" });
    }

    expense.description = req.body.description || expense.description;
    expense.amount = req.body.amount || expense.amount;
    expense.category = req.body.category || expense.category;
    expense.date = req.body.date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
