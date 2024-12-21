export interface TodoStrategy {
    create(todo: any): Promise<any>;
    getAll(): Promise<any[]>;
    getById(id: string): Promise<any>;
    update(id: string, todo: any): Promise<any>;
    delete(id: string): Promise<void>;
}