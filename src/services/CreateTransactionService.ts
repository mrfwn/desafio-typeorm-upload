import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('This transaction without a valid balance', 400);
    }

    const checkIfExistCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkIfExistCategory) {
      const responseCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(responseCategory);

      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: responseCategory.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkIfExistCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
