import { IUserRepository } from "../abstract/IUserRepository";
import { BaseRepository } from "./base/BaseRepository";
import User from "../../models/user";
import Post from "../../models/post";
import Comment from "../../models/comment";
import Permission from "../../models/permission";
import Role from "../../models/role";
import { cache } from "../../lib/cache/CacheManager";
import { Op } from "sequelize";


export class UserRepository<T> extends BaseRepository<any> implements IUserRepository {
  
    constructor() {
        super(User);
    }

    async get(filters: { ids?: number[], email?: string, otherField?: any }, attributes?: string[]): Promise<User[] | null> {
      const whereClause: any = {};
  
      if (filters.ids) {
        whereClause.id = { [Op.in]: filters.ids.map(Number) };
      }
  
      if (filters.email) {
        whereClause.email = filters.email;
      }
  
      if (filters.otherField) {
        whereClause.otherField = filters.otherField;
      }
  
      return await this.model.findAll({
        attributes,
        where: whereClause
      });
    }

    async getWithRelation(): Promise<User[] | null> {
      return await this.model.findAll({
        include: [
          {
            model: Post,
            as: "posts",
            attributes: ["id", "title", "description"],
            include: [
                {
                  model: Comment,
                  as: "comments",
                  attributes: ["id", "description", "rating"]
                }
              ],
          }
        ],
        order: [["id", "DESC"]],
      });
    }

    async getRoleWithPermissions(id:number): Promise<User | null> {

      return await cache.remember(`user_roles_permission:${id}`, 20, async () => {
        return await User.findByPk(id, {
          include: [
            { model: Permission, as: "permissions", required: false },
            { 
              model: Role, 
              as: "roles",
              required: false,
              include: [{ model: Permission, as: "permissions", required: false }]
            }
          ],
        });
      });

    }

    async findByEmail(email:string, scopes: string[] = []): Promise<User | null>  {
      const scopedModel = scopes.length ? this.model.scope(...scopes) : this.model;
      return await scopedModel.findOne({ where: { email } });
    }

}
