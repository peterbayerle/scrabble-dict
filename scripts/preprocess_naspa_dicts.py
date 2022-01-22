import pandas as pd
import json

def intake_df(file_path):
    with open(file_path, 'r') as f:
        data = f.read()

    defs = json.loads(data)

    words = defs["words"]
    words.append(["TRIBESPERSON","TRIBESPERSON","noun_singular",1,""])
    
    return pd.DataFrame(
        defs["words"],
        columns=["word", "root", "pos", "num", "definition"]
    )

class Preprocessor(object):
    def handle_roots(self, df):
        df_roots = df[df['word'] == df['root']]
        df_nonroots = df[df['word'] != df['root']]

        df_roots['word_friendly'] = df_roots['word']
        df_roots['definition_friendly'] = df_roots['definition']
        df_roots['pos_friendly'] = df_roots['pos']

        self.df_roots = df_roots 

        return df_roots, df_nonroots

    def handle_samples_with_1_root(self, df_nonroots):
        root_counts = self.df_roots.groupby('word').agg({'word': 'count'}).rename({'word': 'count'}, axis=1).reset_index()

        df_nonroots_merged = df_nonroots.merge(
            root_counts,
            left_on='root',
            right_on='word',
            suffixes=('', '_root')
        )

        df_has_one_root = df_nonroots_merged[df_nonroots_merged['count'] == 1]
        df_has_many_roots = df_nonroots_merged[df_nonroots_merged['count'] > 1]

        df_has_one_root = df_has_one_root.merge(
            self.df_roots[['word', 'definition', 'pos']],
            left_on='root',
            right_on='word',
            suffixes=('', '_friendly')
        )

        return df_has_one_root, df_has_many_roots

    def set_row_fields(self, row, matching):
        row['word_friendly'] = matching.iloc[0]["word"]
        row['definition_friendly'] = matching.iloc[0]["definition"]
        row['pos_friendly'] = matching.iloc[0]["pos"]

    def get_friendly(self, row):
        r = row['root']
        roots = self.df_roots[self.df_roots['word'] == r]
        num = row['num']

        if len(set(roots['pos'])) == 1:
            # If all have same POS, select the one with the matching num 
            matching = roots[roots['num'] == num]

            if matching.shape[0] == 1:
                self.set_row_fields(row, matching)
        else:
            # there are multiple roots, and some have different POS
            pos_beginning = row['pos'].partition('_')[0]
            roots['pos_beginning'] = roots['pos'].apply(lambda s: s.partition('_')[0])

            roots_matching_pos = roots[roots['pos_beginning'] == pos_beginning]
            
            if roots_matching_pos.shape[0] == 1:
                # only one root has the matching pos, that must be it!
                self.set_row_fields(row, roots_matching_pos)

            else:
                # at least two roots have the same POS, so we go by number
                matching = roots_matching_pos[roots_matching_pos['num'] == num]
            
                if matching.shape[0] == 1:
                    self.set_row_fields(row, matching)

                else:
                    # 209 words in the word dictionary fall into this category
                    # an example is BEATEN:
                    '''
                    ["BEAT","BEAT","verb_past",1,""],
                    ["BEAT","BEAT","verb_present",1,"to strike repeatedly"],
                    ["BEATEN","BEAT","verb_past_participle",1,"< BEAT"],
                    '''
                    # we will try to pick one with a definition, else 0
                    matching_with_def = matching[matching['definition'] != '']
                    matching =  matching_with_def if matching_with_def.shape[0] > 0 else matching

                    self.set_row_fields(row, matching)

        return row


    def transform(self, df):
        # Step 1: handle rows which are roots 
        df_roots, df_nonroots = self.handle_roots(df)
        assert df_roots.shape[0] + df_nonroots.shape[0] == df.shape[0]

        # Step 2: handle rows which are non-roots and which only have 1 root
        df_has_one_root, df_has_many_roots = self.handle_samples_with_1_root(df_nonroots)
        assert df_roots.shape[0] + df_has_one_root.shape[0] + df_has_many_roots.shape[0] == df.shape[0]

        # Step 3: deal with words which have multiple roots
        df_has_many_roots = df_has_many_roots.apply(self.get_friendly, axis=1)
        
        # Step 4: concatenate all dfs
        final = pd.concat(
            (df_roots, df_has_one_root, df_has_many_roots)
        )[['word', 'word_friendly', 'definition_friendly', 'pos_friendly']]

        final['word'] = final['word'].apply(lambda s: s.lower())
        final['word_friendly'] = final['word_friendly'].apply(lambda s: s.lower())

        assert final.shape[0] == df.shape[0]

        return final

def get_words(final, word_list):
    return final[final['word'].isin(word_list)]
    
if __name__ == '__main__':
    naspa_json_path = ...
    naspa_dict_id = ...
    naspa_csv_out_path = ...

    df = intake_df(naspa_json_path)

    final = Preprocessor().transform(df)
    final['dictid'] = naspa_dict_id
    final.to_csv(naspa_csv_out_path, index=False)

    # check some edge cases
    print(
        get_words(final, ["agora", "agorae", "agoras", "agorot", "agoroth"]),
        get_words(final, ["bat", "bats"]),        
        get_words(final, ["know", "knowing", "known"]),
        get_words(final, ["agora", "agorae", "agoras", "agorot", "agoroth"]),
        get_words(final, ["beat", "beaten"]),
        end='\n\n'
    )


