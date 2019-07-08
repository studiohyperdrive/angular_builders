import * as AJV from 'ajv';
import { <%= type %> } from '<%= typePath %>';
import { ValidatorSchema, ValidatorSchemaConstruct } from '@tom-odb/angular-builders';

export class <%= type %>Schema implements ValidatorSchemaConstruct {
  public schema: ValidatorSchema =<%= schema %>;

  private ajv: any;
  private data: <%= type %>;

	constructor(data: any) {
	this.data = data;
		this.ajv = new AJV();
	}

	public validate(data: any): AJV.ErrorObject | boolean {
		const validated = this.ajv.validate(this.schema, data);

		if (!validated) {
			return this.schema.errors;
		}

		return validated;
  }

  public toJSON(): <%= type %> {
    if (!this.data || !this.validate(this.data)) {
      return null;
    }

    return <%= jsonData %>;
  }
}
