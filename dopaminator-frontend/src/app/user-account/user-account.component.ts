import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPostDialogComponent } from '../add-post-dialog/add-post-dialog.component';

interface Post {
  id: number,
  title: string;
  content: string;
  imageUrl?: string;
}

interface User {
  name: string;
  money: number;
  avatarUrl: string;
  posts: Post[];
}

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
  imports: [NgFor, NgIf, MatButtonModule, MatIconModule, MatDialogModule],
  standalone: true
})
export class UserAccountComponent implements OnInit {
  @Input() userName? : string|null;
  loremIpsum: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet diam ut ante tincidunt scelerisque. Aliquam interdum, elit sit amet commodo finibus, lectus ligula ullamcorper arcu, a aliquam diam magna sit amet ante. In quis metus sit amet arcu ultrices imperdiet. Morbi vestibulum sem vitae finibus porttitor. Nunc in mauris a libero sollicitudin convallis. Duis lobortis maximus ex, sit amet facilisis libero rutrum in. Aliquam non semper lectus, quis ultrices dui. Aenean quis nisi nec lorem viverra egestas. Nam rutrum sapien vitae ipsum semper congue."
  user: User = {
    name: '',
    avatarUrl: 'https://via.placeholder.com/150',
    money: 0.1231241178765,
    posts: [
      {
        id: 1,
        title: 'Tytuł1',
        content: this.loremIpsum,
        imageUrl: 'https://via.placeholder.com/300'
      },
      {
        id: 2,
        title: 'Tytuł2',
        content: this.loremIpsum,
        imageUrl: 'https://via.placeholder.com/300'
      },
      {
        id: 3,
        title: 'Tytuł3',
        content: this.loremIpsum,
        imageUrl: 'https://via.placeholder.com/300'
      }
    ]
  };

  currentUser: boolean = false;

  constructor(private cookieService: CookieService, private route: ActivatedRoute, private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userName = params.get('username');
      this.loadUserData();
    });
  }

  loadUserData() {
    if(this.userName) {
      this.apiService.getUser({username: this.userName}).subscribe(user => {
        this.user.name =  user.username;
        this.user.posts = user.posts;
      });
    }
    this.currentUser = (this.userName == this.cookieService.get("username"));
  }

  addPost() {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.addPost({title: result.title, content: result.content}).subscribe(r => {
          this.loadUserData()
        });
      }
    });
  }

  editPost(id: number) {
    var toEdit = this.user.posts.filter(p => {
      return p.id === id
    });
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '400px',
      data: {
        title: toEdit[0].title,
        content: toEdit[0].content
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.editPost(id, {title: result.title, content: result.content}).subscribe(r => {
          this.loadUserData()
        });
      }
    });
  }

  deletePost(id: number) {
    this.apiService.deletePost(id).subscribe(r => {
      console.log(r);
      this.loadUserData();
    })
  }
}
