import * as React from 'react';
import styled from 'styled-components';
import { Book } from '../../store/modules/book/model';

interface Props {
  book: Book;
  setSelectedBookId: (bookId: string) => void;
  handleShowEditModal?: (book: Book) => void;
}

export const BookContext = React.createContext({
  selectedBookId: ''
});

const BookCard: React.FunctionComponent<Props> = props => {
  const book = props.book;
  const context = React.useContext(BookContext);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // PC版のみモーダル表示アイコンを出す
  const editIcon = () => {
    if (!isMobile) {
      return (
        <a
          className={'has-text-grey-lighter'}
          onClick={e => props.handleShowEditModal(book)}
        >
          <i className="fas fa-edit" />
        </a>
      );
    }
  };

  return (
    <Card
      className="card"
      onClick={e => props.setSelectedBookId(book.id)}
      isSelected={context.selectedBookId === book.id}
    >
      <CardContent className="card-image has-text-right">
        {editIcon()}
        <Figure className="image is-128x128">
          <Image
            src={
              book.imageUrl
                ? book.imageUrl
                : 'https://bulma.io/images/placeholders/128x128.png'
            }
          />
        </Figure>
      </CardContent>
      <CardContent className="card-content">
        <p className="title is-5">{book.title}</p>
        <p className="subtitle is-6">{book.author}</p>
      </CardContent>
    </Card>
  );
};

const Card = styled('div')<{ isSelected: boolean }>`
  box-shadow: none;
  border-bottom: solid 1px #e8e8e8;
  background-color: ${props => (props.isSelected ? 'beige' : '')};
`;

const CardContent = styled('div')`
  padding: 1em;
`;

const Figure = styled('figure')`
  margin-left: auto;
  margin-right: auto;
`;

const Image = styled('img')`
  object-fit: contain;
  height: 100% !important;
`;

export default BookCard;
