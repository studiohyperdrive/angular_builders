export interface GenerateSchemasConfig {
	dir: string;
    ignore: string;
    indent: string;
    indentSize: number;
    silent?: boolean;
	tsConfig?: string;
	skipTypeCheck?: boolean;
	strictTuples?: boolean;
	expose?: string;
	jsDoc?: string;
	topRef?: boolean;
}
