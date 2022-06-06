import { CustomResponse } from "../utils/custom-response";
import { StatusCode } from "../utils/status-code";

/**
 * Generic Service class for our models to do handle errors and logic
 */
class ModelService<T> {
  /**
   * @param model - the class you wish to the Service to use
   */
  constructor(protected model: any) {}

  async findAll(): Promise<CustomResponse<StatusCode, T[]>> {
    try {
      const foundModels = await this.model.findAll();
      return { statusCode: StatusCode.Success, model: foundModels };
    } catch (error) {
      console.error(error);
      return { statusCode: StatusCode.ServerError };
    }
  }

  async findByPk(id: string): Promise<CustomResponse<StatusCode, T>> {
    try {
      const foundUser = await this.model.findByPk(id);
      if (foundUser) {
        return { statusCode: StatusCode.Success, model: foundUser };
      } else {
        return { statusCode: StatusCode.NotFound };
      }
    } catch (error) {
      console.error(error);
      return { statusCode: StatusCode.ServerError };
    }
  }

  async save(object: any): Promise<CustomResponse<StatusCode, T>> {
    try {
      const savedModel = await object.save();
      return { statusCode: StatusCode.Created, model: savedModel };
    } catch (error) {
      console.error(error);
      return { statusCode: StatusCode.ServerError };
    }
  }

  async update(id: string, newAttributes: any): Promise<CustomResponse<StatusCode, T>> {
    try {
      const modelToUpdate = await this.model.findByPk(id);
      
      if (modelToUpdate) {
        try {
          const updatedModel = await modelToUpdate.update(newAttributes);
          
          return { statusCode: StatusCode.Success, model: updatedModel };
        } catch (error) {
          return { statusCode: StatusCode.InvalidData };
        }
      } else {
        return { statusCode: StatusCode.NotFound };
      }
    } catch (error) {
      console.error(error);
      return { statusCode: StatusCode.ServerError };
    }
  }

  async delete(id: string): Promise<CustomResponse<StatusCode, T>> {
    try {
      const modelToDelete = await this.model.findByPk(id);

      if (modelToDelete) {
        modelToDelete.destroy();
        return { statusCode: StatusCode.NoContent };
      } else {
        return { statusCode: StatusCode.NotFound };
      }
    } catch (error) {
      console.error(error);
      return { statusCode: StatusCode.ServerError };
    }
  }
}

export { ModelService };
