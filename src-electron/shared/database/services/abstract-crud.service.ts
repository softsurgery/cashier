import { DeepPartial, FindManyOptions, FindOneOptions, ObjectLiteral } from 'typeorm';
import { DatabaseAbstractRepository } from '../repositories/database.repository';
import { PageDto } from '../dtos/database.page.dto';
import { PageMetaDto } from '../dtos/database.page-meta.dto';

export class AbstractCrudService<T extends ObjectLiteral> {
  repository: DatabaseAbstractRepository<T>;
  constructor(repository: DatabaseAbstractRepository<T>) {
    this.repository = repository;
  }

  async findOneById(id: number | string): Promise<T | null> {
    const entity = await this.repository.findOneById(id);
    if (!entity) {
      throw new Error(`${this.repository.getMetadata().name} with id ${id} is not found`);
    }
    return entity;
  }

  async findOneByCondition(query: FindOneOptions<T>): Promise<T | null> {
    const entity = await this.repository.findOne(query);
    if (!entity) return null;
    return entity;
  }

  async findAll(query: FindManyOptions<T> = {}): Promise<T[]> {
    return await this.repository.findAll(query);
  }

  async findAllPaginated(query: FindManyOptions<T> = {}): Promise<PageDto<T>> {
    const count = await this.repository.getTotalCount({
      where: query.where,
    });

    const entities = await this.repository.findAll(query);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.skip),
        take: Number(query.take),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(dto: DeepPartial<T>) {
    return this.repository.save(dto);
  }

  async saveMany(dtos: DeepPartial<T>[]) {
    return this.repository.saveMany(dtos);
  }

  async update(id: string | number, dto: Partial<T>) {
    const entity = await this.findOneById(id);
    if (!entity) throw new Error('Entity not found');
    return this.repository.update(id, dto);
  }

  async updateMany(dtos: DeepPartial<T>[]) {
    return this.repository.saveMany(dtos);
  }

  async softDelete(id: string): Promise<T | null> {
    return this.repository.softDelete(id);
  }

  async delete(id: string): Promise<T | null> {
    const entity = await this.findOneById(id);
    if (!entity) throw new Error('Entity not found');
    return this.repository.remove(entity);
  }
}
