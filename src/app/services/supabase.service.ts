import { Injectable } from '@angular/core';
import { AuthError, AuthResponse, User } from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';
import { supabase } from '../../db/supabase.client';


export enum TableName {
  Boxes = 'boxes',
  Flashcards = 'flashcards',
  Tags = 'tags',
  BoxTags = 'box_tags',
  GenerationLog = 'generation_log'
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  
  constructor() { }

  /**
   * Get the current logged in user
   */
  getCurrentUser(): Observable<User | null> {
    return from(supabase.auth.getUser())
      .pipe(
        map(response => response.data?.user || null)
      );
  }

  /**
   * Sign up a new user
   */
  signUp(email: string, password: string): Observable<AuthResponse> {
    return from(supabase.auth.signUp({ email, password }));
  }

  /**
   * Sign in a user
   */
  signIn(email: string, password: string): Observable<AuthResponse> {
    return from(supabase.auth.signInWithPassword({ email, password }));
  }

  /**
   * Sign out the current user
   */
  signOut(): Observable<{ error: AuthError | null }> {
    return from(supabase.auth.signOut());
  }

  /**
   * Get data from a table
   */
  getAll(tableName: TableName, options?: { 
    limit?: number,
    orderBy?: { column: string, ascending?: boolean }
  }): Observable<any[]> {
    let query = supabase.from(tableName).select('*');
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.orderBy) {
      query = query.order(
        options.orderBy.column, 
        { ascending: options.orderBy.ascending ?? true }
      );
    }
    
    return from(query).pipe(
      map(response => {
        const { data, error } = response as any;
        if (error) {
          throw error;
        }
        return data || [];
      })
    );
  }

  /**
   * Get a single item by id
   */
  getById(tableName: TableName, id: string): Observable<any> {
    return from(
      supabase.from(tableName)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        const { data, error } = response as any;
        if (error) {
          throw error;
        }
        return data;
      })
    );
  }

  /**
   * Insert a new item
   */
  insert(tableName: TableName, data: any): Observable<any> {
    return from(
      supabase.from(tableName)
        .insert(data)
        .select()
        .single()
    ).pipe(
      map(response => {
        const { data: result, error } = response as any;
        if (error) {
          throw error;
        }
        return result;
      })
    );
  }

  /**
   * Update an existing item
   */
  update(tableName: TableName, id: string, data: any): Observable<any> {
    return from(
      supabase.from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        const { data: result, error } = response as any;
        if (error) {
          throw error;
        }
        return result;
      })
    );
  }

  /**
   * Delete an item
   */
  delete(tableName: TableName, id: string): Observable<void> {
    return from(
      supabase.from(tableName)
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        const { error } = response as any;
        if (error) {
          throw error;
        }
        return;
      })
    );
  }

  /**
   * Custom query with filters
   */
  query(tableName: TableName, queryFn: (query: any) => any): Observable<any[]> {
    const baseQuery = supabase.from(tableName).select('*');
    const customQuery = queryFn(baseQuery);
    
    return from(customQuery).pipe(
      map(response => {
        const { data, error } = response as any;
        if (error) {
          throw error;
        }
        return data || [];
      })
    );
  }
} 