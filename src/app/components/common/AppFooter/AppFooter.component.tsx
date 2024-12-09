import { GithubIcon, LinkedinIcon } from '@strutio/app/icons';
import Link from 'next/link';
import React from 'react';

import styles from './AppFooter.module.scss';

export default function AppFooter() {
  return (
    <footer className={styles.single_line_footer}>
      <div className={styles.line_footer__content}>
        <div className={styles.line_footer__content__title}>
          Strutio © {new Date().getFullYear()} By Aymen Koched
        </div>
        <div className={styles.line_footer__content__rules}>
          <Link
            href="https://www.linkedin.com/in/aymen-koched-17a6b7274/"
            className={styles.line_footer__content__rules__content}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon className={styles.icon} />
            <p className={styles.line_footer__content__rules__down_text}>
              LinkedIn
            </p>
          </Link>
          <Link
            href="https://github.com/AymenKoched"
            className={styles.line_footer__content__rules__content}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className={styles.icon} />
            <p className={styles.line_footer__content__rules__down_text}>
              Github
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
