import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
// import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const [transaction] = await transactionsRepository.findByIds([id]);

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
