import { Injectable } from '@angular/core';
import { User } from './user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private users: User[] = [];
  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(this.users);

  constructor() { }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUser(id: number): Observable<User | null> {
    return this.usersSubject.pipe(
      map(users => users.find(user => user.id === id) || null)
    );
  }

  addUser(user: User): void {
    user.id = this.generateUniqueId();
    this.users.push(user);
    this.usersSubject.next(this.users);
  }

  updateUser(id: number, user: User): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...user, id };
      this.usersSubject.next(this.users);
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.usersSubject.next(this.users);
  }

  private generateUniqueId(): number {
    // Generate a unique ID (e.g., incrementing from the current max ID)
    const maxId = Math.max(...this.users.map(user => user.id), 0);
    return maxId + 1;
  }
}
