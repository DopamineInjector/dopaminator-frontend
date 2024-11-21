import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

interface Post {
  title: string;
  description: string;
  imageUrl: string;
}

interface User {
  name: string;
  avatarUrl: string;
  posts: Post[];
}

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
  imports: [NgFor],
  standalone: true
})
export class UserAccountComponent implements OnInit {
  @Input() userName? : string|null;
  loremIpsum: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet diam ut ante tincidunt scelerisque. Aliquam interdum, elit sit amet commodo finibus, lectus ligula ullamcorper arcu, a aliquam diam magna sit amet ante. In quis metus sit amet arcu ultrices imperdiet. Morbi vestibulum sem vitae finibus porttitor. Nunc in mauris a libero sollicitudin convallis. Duis lobortis maximus ex, sit amet facilisis libero rutrum in. Aliquam non semper lectus, quis ultrices dui. Aenean quis nisi nec lorem viverra egestas. Nam rutrum sapien vitae ipsum semper congue."
  user: User = {
    name: '',
    avatarUrl: 'https://via.placeholder.com/150',
    posts: [
      {
        title: 'Tytuł1',
        description: this.loremIpsum,
        imageUrl: 'https://via.placeholder.com/300'
      },
      {
        title: 'Tytuł2',
        description: this.loremIpsum,
        imageUrl: 'https://via.placeholder.com/300'
      },
      {
        title: 'Tytuł3',
        description: this.loremIpsum,
        imageUrl: 'https://via.placeholder.com/300'
      }
    ]
  };

  currentUser: boolean = false;

  constructor() {}

  ngOnInit(): void {
    //TODO: generowanie obiektu user na bazie danych zaciągniętych z BE
    if(this.userName != null) {
      this.user.name = this.userName;
    }
  }
}
