import { CustomResponse } from "../utils/custom-response";
import { StatusCode as sc } from "../utils/status-code";

/**
 * Generic Service class for our models to do handle errors and logic
 */
class ModelService<T> {
  /**
   * @param model - the class you wish to the Service to use
   */
  constructor(protected model: any) {}

  async findAll(): Promise<CustomResponse<T>> {
    try {
      const foundModels = await this.model.findAll();
      return { statusCode: sc.Success, model: foundModels };
    } catch (error) {
      console.error(error);
      return { statusCode: sc.ServerError };
    }
  }

  async findByPk(id: string): Promise<CustomResponse<T>> {
    try {
      const foundUser = await this.model.findByPk(id);
      if (foundUser) {
        return { statusCode: sc.Success, model: foundUser };
      } else {
        return { statusCode: sc.NotFound };
      }
    } catch (error) {
      console.error(error);
      return { statusCode: sc.ServerError };
    }
  }

  async save(object: any): Promise<CustomResponse<T>> {
    try {
      const savedModel = await object.save();
      return { statusCode: sc.Created, model: savedModel };
    } catch (error) {
      console.error(error);
      return { statusCode: sc.ServerError };
    }
  }

  async update(id: string, newAttributes: any): Promise<CustomResponse<T>> {
    try {
      const modelToUpdate = await this.model.findByPk(id);
      if (modelToUpdate) {
        try {
          const updatedModel = await modelToUpdate.update(newAttributes);
          return { statusCode: sc.Success, model: updatedModel };
        } catch (error) {
          return { statusCode: sc.InvalidData };
        }
      } else {
        return { statusCode: sc.NotFound };
      }
    } catch (error) {
      console.error(error);
      return { statusCode: sc.ServerError };
    }
  }

  async delete(id: string): Promise<CustomResponse<T>> {
    try {
      const modelToDelete = await this.model.findByPk(id);

      if (modelToDelete) {
        modelToDelete.destroy();
        return { statusCode: sc.NoContent };
      } else {
        return { statusCode: sc.NotFound };
      }
    } catch (error) {
      console.error(error);
      return { statusCode: sc.ServerError };
    }
  }
}

export { ModelService };
